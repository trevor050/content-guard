/**
 * Baselines that give the content-guard numbers something to be measured against.
 */
import { Filter } from 'bad-words'
import { englishDataset, englishRecommendedTransformers, RegExpMatcher } from 'obscenity'
import type { Example } from './datasets.ts'

export type Classifier = (text: string) => boolean

/** `bad-words`: the classic word-list filter (exact words, no normalization). */
export function badWords(): Classifier {
  const filter = new Filter()
  return (text) => {
    try {
      return filter.isProfane(text)
    } catch {
      return false
    }
  }
}

/** `obscenity` with its recommended English dataset and anti-obfuscation transformers. */
export function obscenity(): Classifier {
  const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers })
  return (text) => matcher.hasMatch(text)
}

/**
 * Multinomial Naive Bayes on word unigrams, trained on the dev split of the same
 * dataset. This is the "you have labeled in-domain data" baseline: it shows what a
 * forty-line supervised model gets that a general-purpose rule set does not.
 */
export function naiveBayes(train: readonly Example[]): Classifier {
  const tokenize = (text: string) => text.toLowerCase().match(/[a-z0-9']+/g) ?? []
  const counts = [new Map<string, number>(), new Map<string, number>()]
  const totals = [0, 0]
  const docs = [0, 0]
  for (const { text, label } of train) {
    const c = label ? 1 : 0
    docs[c]!++
    for (const token of tokenize(text)) {
      counts[c]!.set(token, (counts[c]!.get(token) ?? 0) + 1)
      totals[c]!++
    }
  }
  const vocab = new Set([...counts[0]!.keys(), ...counts[1]!.keys()]).size
  const prior = [Math.log(docs[0]! / train.length), Math.log(docs[1]! / train.length)]
  return (text) => {
    const score = [prior[0]!, prior[1]!]
    for (const token of tokenize(text)) {
      for (const c of [0, 1]) score[c]! += Math.log(((counts[c]!.get(token) ?? 0) + 1) / (totals[c]! + vocab))
    }
    return score[1]! > score[0]!
  }
}
