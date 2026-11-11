/**
 * Toxicity lexicon.
 *
 * Every entry lists its surface forms explicitly instead of generating suffixes,
 * because generated forms are how word-list filters end up flagging "cumin" or
 * "assassin".
 *
 * Each term carries `p`: the share of Civil Comments *validation-split* comments
 * containing the word that crowd raters labeled toxic (scripts/term-stats.ts).
 * The weight is -ln(1 - p), so a single untargeted occurrence scores about p and
 * crosses the default 0.5 threshold only if the word is toxic more often than not.
 * Deliberate overrides: slurs are pinned at 0.9 regardless of how a news-comment
 * audience labels them, a few mild words are capped below 0.5, and words that
 * collide with names ("Dick") are set by judgment.
 */

export type TermKind = 'slur' | 'profanity' | 'insult'

export interface Term {
  /** Canonical form used in reasons. */
  readonly word: string
  readonly kind: TermKind
  /** Additive evidence on the toxicity score. */
  readonly weight: number
  /** All surface forms (lowercase) that count as this term. */
  readonly forms: readonly string[]
}

const t = (word: string, kind: TermKind, p: number, ...forms: string[]): Term => ({
  word,
  kind,
  weight: Math.round(-Math.log(1 - p) * 100) / 100,
  forms: [word, ...forms],
})

export const TERMS: readonly Term[] = [
  // Identity slurs: pinned, never softened by context.
  t('nigger', 'slur', 0.9, 'niggers', 'nigga', 'niggas', 'niggaz'),
  t('faggot', 'slur', 0.9, 'faggots', 'fag', 'fags', 'faggy'),
  t('dyke', 'slur', 0.85, 'dykes'),
  t('tranny', 'slur', 0.85, 'trannies'),
  t('retard', 'slur', 0.75, 'retards', 'retarded'),
  t('spic', 'slur', 0.9, 'spics'),
  t('chink', 'slur', 0.9, 'chinks'),
  t('kike', 'slur', 0.9, 'kikes'),
  t('wetback', 'slur', 0.9, 'wetbacks'),
  t('gook', 'slur', 0.9, 'gooks'),
  t('raghead', 'slur', 0.9, 'ragheads', 'towelhead', 'towelheads'),
  t('beaner', 'slur', 0.9, 'beaners'),

  // Profanity.
  t('fuck', 'profanity', 0.85, 'fucks', 'fucked', 'fucking', 'fuckin', 'fucker', 'fuckers', 'fuckface',
    'fuckwit', 'fuckwits', 'fuckhead', 'motherfucker', 'motherfuckers', 'motherfucking', 'fuk', 'fck',
    'fking', 'effing', 'fuckery'),
  t('cunt', 'profanity', 0.9, 'cunts'),
  t('shit', 'profanity', 0.68, 'shits', 'shitty', 'shitting', 'bullshit', 'horseshit', 'shite'),
  t('shithead', 'insult', 0.85, 'shitheads', 'shitbag', 'shitstain'),
  t('bitch', 'profanity', 0.69, 'bitches', 'bitchy', 'bitching', 'biatch'),
  t('asshole', 'insult', 0.66, 'assholes', 'arsehole', 'arseholes', 'asshat', 'asshats'),
  t('ass', 'profanity', 0.6, 'arse', 'asses'),
  t('dumbass', 'insult', 0.67, 'dumbasses', 'jackass', 'jackasses', 'smartass'),
  t('bastard', 'profanity', 0.53, 'bastards'),
  t('dick', 'profanity', 0.45, 'dicks'),
  t('dickhead', 'insult', 0.8, 'dickheads'),
  t('cock', 'profanity', 0.5, 'cocks', 'cocksucker', 'cocksuckers'),
  t('pussy', 'profanity', 0.7, 'pussies'),
  t('prick', 'insult', 0.6, 'pricks'),
  t('twat', 'insult', 0.8, 'twats'),
  t('wanker', 'insult', 0.8, 'wankers', 'wank'),
  t('slut', 'insult', 0.75, 'sluts', 'slutty'),
  t('whore', 'insult', 0.68, 'whores'),
  t('douche', 'insult', 0.6, 'douches', 'douchebag', 'douchebags'),
  t('piss', 'profanity', 0.33, 'pissed', 'pissing'),
  t('crap', 'profanity', 0.45, 'crappy'),
  t('damn', 'profanity', 0.35, 'damned', 'goddamn', 'dammit'),
  t('wtf', 'profanity', 0.42),
  t('stfu', 'profanity', 0.6),
  t('gtfo', 'profanity', 0.6),

  // Insults. Most are only borderline on their own; aiming them at the reader
  // ("you are pathetic") multiplies the weight (see detectors/toxicity.ts).
  t('idiot', 'insult', 0.89, 'idiots'),
  t('idiotic', 'insult', 0.71, 'idiocy'),
  t('moron', 'insult', 0.89, 'morons'),
  t('moronic', 'insult', 0.69),
  t('imbecile', 'insult', 0.8, 'imbeciles'),
  t('cretin', 'insult', 0.6, 'cretins'),
  t('stupid', 'insult', 0.8, 'stupidest', 'stoopid', 'stupidity'),
  t('dumb', 'insult', 0.63, 'dumber', 'dumbest'),
  t('dimwit', 'insult', 0.55, 'dimwits', 'halfwit', 'halfwits', 'nitwit', 'nitwits', 'numbskull'),
  t('loser', 'insult', 0.55, 'losers'),
  t('pathetic', 'insult', 0.68),
  t('scum', 'insult', 0.74, 'scumbag', 'scumbags'),
  t('hypocrite', 'insult', 0.7, 'hypocrites'),
  t('buffoon', 'insult', 0.67, 'buffoons'),
  t('parasite', 'insult', 0.7, 'parasites'),
  t('jerk', 'insult', 0.55, 'jerks'),
  t('coward', 'insult', 0.55, 'cowards'),
  t('fool', 'insult', 0.58, 'fools'),
  t('clown', 'insult', 0.57, 'clowns'),
  t('sucker', 'insult', 0.57, 'suckers'),
  t('ignorant', 'insult', 0.57),
  t('lunatic', 'insult', 0.58, 'lunatics'),
  t('sociopath', 'insult', 0.52, 'psychopath', 'sociopaths', 'psychopaths'),
  t('pervert', 'insult', 0.55, 'perverts'),
  t('traitor', 'insult', 0.45, 'traitors'),
  t('crook', 'insult', 0.47, 'crooks'),
  t('rubbish', 'insult', 0.45),
  t('garbage', 'insult', 0.45),
  t('liar', 'insult', 0.45, 'liars'),
  t('disgusting', 'insult', 0.45),
  t('foolish', 'insult', 0.42),
  t('troll', 'insult', 0.4, 'trolls'),
  t('bigot', 'insult', 0.37, 'bigots'),
  t('worthless', 'insult', 0.38),
  t('trash', 'insult', 0.35),
  t('pig', 'insult', 0.43, 'pigs'),
  t('libtard', 'insult', 0.3, 'libtards'),
  t('noob', 'insult', 0.35, 'noobs', 'n00b', 'scrub'),
  t('freak', 'insult', 0.26, 'freaks'),
  t('creep', 'insult', 0.33, 'creeps'),
  t('ugly', 'insult', 0.2),
]

/**
 * Words used by phrase rules and pronoun targeting. The normalizer only accepts a
 * de-obfuscated token (leetspeak, homoglyphs, stretched letters) when it lands on
 * a word in this vocabulary or the lexicon. That keeps "h264" and "x86" intact.
 */
export const PHRASE_WORDS: readonly string[] = [
  'you', 'your', 'yourself', 'yourselves', 'youre', 'ur', 'u', 'ya', 'are', 'an', 'a', 'the', 'i', 'im',
  'will', 'go', 'get', 'so', 'such', 'is', 'and', 'to', 'die', 'dead', 'kill', 'hope', 'should', 'off',
  'shut', 'up', 'of', 'piece', 'son', 'hang', 'shoot', 'murder', 'rape', 'hurt', 'stab', 'beat', 'know',
  'where', 'live', 'back', 'watch', 'nobody', 'likes', 'cares', 'hate', 'eat', 'suck', 'my', 'me', 'hell',
  'people', 'like', 'all', 'lost', 'meat', 'wrong', 'screw', 'rot', 'mouth', 'face', 'complete', 'total', 'absolute', 'little', 'what', 'free', 'click', 'here',
  'now', 'win', 'winner', 'cash', 'prize', 'claim', 'viagra', 'cialis', 'casino', 'bitcoin', 'crypto',
  'loser', 'retard', 'kys', 'not', 'never', 'deserve', 'gonna', 'going', 'am', 'cancer', 'bleach', 'drink',
]

/** Spam vocabulary, so "c0ngr4tul4ti0ns" and "v e r i f y" decode too. */
export const SPAM_WORDS: readonly string[] = (
  'congratulations winner won prize claim cash verify account suspended password bitcoin crypto viagra ' +
  'cialis casino bonus loan credit offer urgent selected iphone gift card money double guaranteed returns ' +
  'seo services website google singles area meet hot spins pharmacy prescription approved instantly bank ' +
  'unlock payday page first buy order call text reply stop limited time act'
).split(' ')

/** Lowercase surface form -> term. */
export const FORM_INDEX: ReadonlyMap<string, Term> = new Map(
  TERMS.flatMap((term) => term.forms.map((form) => [form, term] as const)),
)

/** Every word the normalizer may decode obfuscated tokens into. */
export function buildVocabulary(extra: Iterable<string> = []): Set<string> {
  return new Set([...FORM_INDEX.keys(), ...PHRASE_WORDS, ...SPAM_WORDS, ...extra])
}
