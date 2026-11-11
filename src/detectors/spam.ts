import type { Context } from '../context.ts'
import type { NormalizedText } from '../normalize.ts'
import type { Reason } from '../types.ts'

interface SpamRule {
  readonly rule: string
  readonly description: string
  readonly pattern: RegExp
  readonly weight: number
  /** Weak rules are halved in technical context ("free up memory", "click the button"). */
  readonly weak?: boolean
}

const URL = /\b(?:https?:\/\/|www\.)[^\s<>"']+|\b[a-z0-9-]+\.(?:com|net|org|info|biz|co|io|ly|me|xyz|top|click|link|online|site|shop|store|ru|cn|tk|ml|ga|cf|gq|icu|buzz|loan|work)\b(?:\/[^\s<>"']*)?/g

const RULES: readonly SpamRule[] = [
  {
    rule: 'spam:shortener-url',
    description: 'Link shortener hides the destination',
    pattern: /\b(?:bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|tiny\.cc|rebrand\.ly)\//,
    weight: 0.5,
  },
  {
    rule: 'spam:ip-url',
    description: 'Link points at a raw IP address',
    pattern: /\bhttps?:\/\/\d{1,3}(?:\.\d{1,3}){3}/,
    weight: 0.5,
  },
  {
    rule: 'spam:cheap-tld',
    description: 'Link uses a top-level domain favored by spammers',
    pattern: /\b[a-z0-9-]+\.(?:xyz|top|click|loan|work|gq|tk|ml|cf|ga|icu|buzz|cam|rest)\b/,
    weight: 0.35,
  },
  {
    rule: 'spam:prize',
    description: 'Claims the reader won or was selected for a prize',
    pattern: /\b(?:(?:you|u)(?:ve| have| hav)? (?:just )?(?:been )?(?:won(?![' ]?t\b)|selected|chosen)\b|(?:you|u) (?:are|r) (?:a |our )?(?:lucky )?winner|we have a winner|congratulations?!? (?:you|u|ur)\b|congrats!? (?:you|u)\b|(?:claim|collect) (?:your|ur|the|a)? ?(?:prize|reward|cash|gift|bonus|award|holiday)|(?:guaranteed|cash|holiday) (?:prize|award)|(?:have|has|been) (?:been )?awarded|winner of|(?:a|your|ur) chance to win|entitled to (?:claim|a free|update|compensation)|your lucky day)/,
    weight: 0.75,
  },
  {
    rule: 'spam:money-bait',
    description: 'Large money amounts used as bait',
    pattern: /(?:[£$€]\s?\d[\d,]{2,}(?:\.\d+)?|\b\d[\d,]{2,} ?(?:cash|pounds|dollars|usd|gbp|euros?)\b)(?![\d,]*\s*(?:per (?:year|annum)|salary|budget))/,
    weight: 0.35,
  },
  {
    rule: 'spam:premium-rate',
    description: 'Premium-rate pricing or short-code instructions typical of SMS spam',
    pattern: /\b\d{2,3} ?p ?(?:\/|per |pm\b|ppm\b|msg\b|min\b|a msg)|\d ?ppm\b|[£$€]\d+(?:[.,]\d+)? ?(?:\/|per |a )(?:min|minute|wk|week|msg|month|txt)\b|\b(?:text|txt|txting|send|reply|rply)(?: [a-z0-9]+){0,4} (?:to|on) \d{4,6}\b|\b(?:0(?:9\d{8,9}|87\d{7,9}|8\d{2}[\s-]?\d{3}[\s-]?\d{3,4})|1[\s-]?900[\s-]?\d{3}[\s-]?\d{4})\b/,
    weight: 0.8,
  },
  {
    rule: 'spam:opt-out',
    description: 'Mass-message opt-out instructions',
    pattern: /\b(?:text|txt|reply|send) stop\b|\bstop to (?:opt|end|unsubscribe|cancel|stop)|opt.?out\b|2 ?stop|\bunsub(?:scribe)? (?:here|now|at|reply|with|text)|\bt ?& ?c|\bts ?& ?cs|to (?:stop|cancel) (?:receiving|these|this service)/,
    weight: 0.75,
  },
  {
    rule: 'spam:phone-call-to-action',
    description: 'Asks the reader to call or text a phone number',
    pattern: /\b(?:call|ring|dial|text|txt|phone)(?: [a-z]+){0,4}:? ?\+?\d[\d\s-]{8,}\d/,
    weight: 0.4,
  },
  {
    rule: 'spam:call-to-action',
    description: 'High-pressure call to action',
    pattern: /\b(?:act now|call now|order now|buy now|apply now|click (?:here|below|the link|this link)|limited time|offer expires|expires (?:today|soon|tonight)|last chance|don ?t miss (?:out|this)|urgent!|reply (?:yes|now|win)|while (?:stocks|supplies) last)\b/,
    weight: 0.4,
    weak: true,
  },
  {
    rule: 'spam:free-offer',
    description: 'Unsolicited free offer',
    pattern: /\b(?:100% free|absolutely free|totally free|free (?:entry|gift|ringtone|tone|msg|trial|money|cash|iphone|ipad|vacation|holiday|camera|phone|nokia|access|bonus|spins?|credit|membership|giveaway|sample)s?|for free!|risk.free|no (?:cost|obligation))\b/,
    weight: 0.45,
    weak: true,
  },
  {
    rule: 'spam:phishing',
    description: 'Asks the reader to verify or unlock an account',
    pattern: /\b(?:verify|confirm|validate|update|unlock|reactivate|restore) (?:your |ur )?(?:account|identity|password|billing|payment (?:info|details|method)|bank details|login|credentials)|\baccount (?:has been |was |is |will be )?(?:suspended|locked|limited|disabled|compromised|on hold)|\b(?:unusual|suspicious) (?:sign.?in|login|activity)|\bimmediate action required/,
    weight: 0.75,
  },
  {
    rule: 'spam:credentials',
    description: 'Asks for passwords, codes or banking details',
    pattern: /\b(?<!(?:never|not|don.?t|do not|won.?t) )(?:send|give|share|provide|enter|reply with|tell me) (?:me |us )?(?:your |ur )(?:password|passcode|pin|otp|one.time code|verification code|ssn|social security|bank (?:details|account)|card (?:number|details)|seed phrase|recovery phrase)/,
    weight: 1.0,
  },
  {
    rule: 'spam:get-rich',
    description: 'Get-rich-quick or investment scam language',
    pattern: /\b(?:double your (?:money|bitcoin|crypto|investment)|guaranteed (?:returns?|profits?|income)|passive income|make \$?\d[\d,]* (?:a|per) (?:day|week|hour)|work from home and earn|earn (?:money|cash|\$\d+) (?:fast|online|from home)|investment opportunity|crypto (?:profits?|signals?|trading bot)|forex signals?|financial freedom)\b/,
    weight: 0.75,
  },
  {
    rule: 'spam:seo-outreach',
    description: 'SEO or backlink outreach typical of contact-form spam',
    pattern: /\b(?:seo (?:services?|expert|agency|package|team)|(?:first|top) page (?:of |on )?google|rank (?:your (?:site|website)|higher on google|on google)|backlinks?|guest posts?|domain authority|increase (?:your )?(?:website )?(?:traffic|rankings?)|(?:website|web) (?:design|development|redesign) (?:services?|company|agency))\b/,
    weight: 0.75,
  },
  {
    rule: 'spam:cold-outreach',
    description: 'Generic cold-outreach opener',
    pattern: /\b(?:we (?:noticed|visited|reviewed|came across) your (?:website|site)|dear (?:website |site )?(?:owner|webmaster|sir.?madam)|(?:improve|boost) your online presence|increase your (?:sales|leads))\b/,
    weight: 0.45,
  },
  {
    rule: 'spam:pharma',
    description: 'Pharmacy spam',
    pattern: /\b(?:viagra|cialis|levitra|xanax|tramadol|phentermine|online pharmacy|no prescription|weight loss pills?|diet pills?|male enhancement)\b/,
    weight: 0.9,
  },
  {
    rule: 'spam:adult',
    description: 'Adult or dating spam',
    pattern: /\b(?:hot singles|sexy (?:girls|singles|babes|chat)|horny|xxx (?:videos?|movies|pics|site)|porn|adult (?:videos?|content|dating|parties)|meet (?:local )?(?:girls|women|singles|someone sexy)|webcam girls|nude (?:pics|photos)|dating (?:service|network|site)|to find out who (?:it is|fancies)|someone (?:you know )?(?:fancies|has contacted))\b/,
    weight: 0.8,
  },
  {
    rule: 'spam:loan',
    description: 'Loan or debt offer',
    pattern: /\b(?:pre.?approved|loans? (?:approved|offer)|instant (?:loan|cash)|debt (?:relief|consolidation)|bad credit (?:ok|welcome|accepted|no problem)|payday loans?|cash advance)\b/,
    weight: 0.75,
  },
  {
    rule: 'spam:gambling',
    description: 'Casino or betting promotion',
    pattern: /\b(?:online casino|casino bonus|free spins|bet now|sports betting|jackpot)\b/,
    weight: 0.6,
  },
]

const BLUNT_LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '9': 'g' }

const DISPOSABLE_EMAIL = /@(?:mailinator|guerrillamail|10minutemail|tempmail|temp-mail|yopmail|trashmail|sharklasers|getnada|dispostable|maildrop|throwawaymail|fakeinbox|mailnesia)\./

export interface SpamExtras {
  /** Original (un-normalized) text, for shouting detection. */
  readonly original: string
  readonly email?: string
  readonly name?: string
}

export function detectSpam(text: NormalizedText, context: Context, extras: SpamExtras): Reason[] {
  const reasons: Reason[] = []
  const push = (rule: string, description: string, match: string, weight: number) =>
    reasons.push({ category: 'spam', rule, description, match, weight: Math.round(weight * 100) / 100 })

  // Rules see three views: the folded text, the same with punctuation flattened
  // ("txt: shop to 80878"), and the de-obfuscated text ("v1agra", "c l a i m").
  const loose = text.plain.replace(/[^\p{L}\p{N}£$€%&+/.@:-]+/gu, ' ').replace(/\s+/g, ' ')
  const views = [text.plain, loose, text.decoded]
  // Spam vocabulary is open-ended, so also try a blunt de-obfuscation that the
  // toxicity rules cannot afford: every mixed letter/digit token is decoded and
  // stretched letters are squeezed, whether or not the result is a known word.
  const blunt = text.decoded.replace(/\b(?=[a-z0-9]*[a-z])(?=[a-z0-9]*[0-9])[a-z0-9]+\b/g, (token) =>
    token.replace(/[0-9]/g, (digit) => BLUNT_LEET[digit] ?? digit),
  )
  for (const view of [blunt, blunt.replace(/(.)\1{2,}/g, '$1'), blunt.replace(/(.)\1{2,}/g, '$1$1')]) {
    if (!views.includes(view)) views.push(view)
  }
  for (const rule of RULES) {
    let match: RegExpExecArray | null = null
    for (const view of views) if ((match = rule.pattern.exec(view))) break
    if (!match) continue
    const soften = rule.weak && context.technical
    push(rule.rule, rule.description + (soften ? ' (softened: technical context)' : ''), match[0], soften ? rule.weight / 2 : rule.weight)
  }

  const urls = text.plain.match(URL) ?? []
  if (urls.length >= 3) push('spam:many-links', `Contains ${urls.length} links`, urls.slice(0, 3).join(' '), context.technical ? 0.2 : 0.4)
  else if (urls.length > 0) push('spam:link', 'Contains a link', urls[0]!, 0.15)

  const letters = extras.original.replace(/[^A-Za-z]/g, '')
  if (letters.length >= 20) {
    const upper = letters.replace(/[^A-Z]/g, '').length / letters.length
    if (upper >= 0.6) push('spam:shouting', 'Mostly upper-case text', extras.original.slice(0, 40), 0.3)
  }
  if (/\bFREE\b/.test(extras.original)) {
    push('spam:shouted-free', 'Shouts "FREE"', 'FREE', context.technical ? 0.15 : 0.3)
  }
  const bangs = extras.original.match(/!{3,}|\${2,}/)
  if (bangs) push('spam:punctuation', 'Excessive "!!!" or "$$"', bangs[0], 0.2)

  if (extras.email && DISPOSABLE_EMAIL.test(extras.email.toLowerCase())) {
    push('spam:disposable-email', 'Disposable email address', extras.email, 0.45)
  }
  if (extras.name && /https?:\/\/|www\.|\.(?:com|net|ru)\b/i.test(extras.name)) {
    push('spam:link-in-name', 'Name field contains a link', extras.name, 0.6)
  }
  return reasons
}
