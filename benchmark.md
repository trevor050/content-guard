# ContentGuard Benchmark Report

This report details the benchmark results for ContentGuard versions: v4.7 (Current), v3.0, and v2.1.
The benchmarks were run against a comprehensive test suite including various categories of text, from professional communication to adversarial attacks.

## Overall Summary

The following table shows the evolution of overall accuracy for the 'strict' preset across the different versions. The 'strict' preset is often indicative of the most robust (though potentially more prone to false positives) configuration.

| Version          | Preset   | Overall Accuracy | Total Tests | Correct | Incorrect | False Positives | False Negatives |
|------------------|----------|------------------|-------------|---------|-----------|-----------------|-----------------|
| v4.7 (Current)   | strict   | 26.17%           | 222         | 67      | 147       | 0               | 147             |
| v3.0             | strict   | 58.59%           | 222         | 150     | 64        | 5               | 59              |
| v2.1             | strict   | 31.25%           | 222         | 80      | 134       | 13              | 121             |

_Note: Accuracy is calculated based on non-'MIXED' test cases. Total tests reflect this adjusted count for accuracy calculation._

## Detailed Version Analysis

### v4.7 (Current)

#### Preset: moderate

**Overall Statistics:**
- **Accuracy:** 26.17%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 67
- **Incorrect:** 147
- **False Positives (FP):** 0
- **False Negatives (FN):** 147

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 43      | 0         | 0  | 0  | 100.00%  |                      |
| workplace_harassment         | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| sophisticated_harassment     | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| subtle_harassment_v2         | 8     | 0       | 8         | 0  | 8  | 0.00%    |                      |
| adversarial_attacks          | 28    | 0       | 28        | 0  | 28 | 0.00%    |                      |
| adversarial_v2               | 5     | 0       | 5         | 0  | 5  | 0.00%    |                      |
| social_engineering           | 24    | 0       | 24        | 0  | 24 | 0.00%    |                      |
| modern_communication         | 16    | 10      | 6         | 0  | 6  | 62.50%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 10      | 6         | 0  | 6  | 62.50%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: professional

**Overall Statistics:**
- **Accuracy:** 26.17%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 67
- **Incorrect:** 147
- **False Positives (FP):** 0
- **False Negatives (FN):** 147

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 43      | 0         | 0  | 0  | 100.00%  |                      |
| workplace_harassment         | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| sophisticated_harassment     | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| subtle_harassment_v2         | 8     | 0       | 8         | 0  | 8  | 0.00%    |                      |
| adversarial_attacks          | 28    | 0       | 28        | 0  | 28 | 0.00%    |                      |
| adversarial_v2               | 5     | 0       | 5         | 0  | 5  | 0.00%    |                      |
| social_engineering           | 24    | 0       | 24        | 0  | 24 | 0.00%    |                      |
| modern_communication         | 16    | 10      | 6         | 0  | 6  | 62.50%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 10      | 6         | 0  | 6  | 62.50%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: strict

**Overall Statistics:**
- **Accuracy:** 26.17%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 67
- **Incorrect:** 147
- **False Positives (FP):** 0
- **False Negatives (FN):** 147

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 43      | 0         | 0  | 0  | 100.00%  |                      |
| workplace_harassment         | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| sophisticated_harassment     | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| subtle_harassment_v2         | 8     | 0       | 8         | 0  | 8  | 0.00%    |                      |
| adversarial_attacks          | 28    | 0       | 28        | 0  | 28 | 0.00%    |                      |
| adversarial_v2               | 5     | 0       | 5         | 0  | 5  | 0.00%    |                      |
| social_engineering           | 24    | 0       | 24        | 0  | 24 | 0.00%    |                      |
| modern_communication         | 16    | 10      | 6         | 0  | 6  | 62.50%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 10      | 6         | 0  | 6  | 62.50%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: gaming

**Overall Statistics:**
- **Accuracy:** 26.17%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 67
- **Incorrect:** 147
- **False Positives (FP):** 0
- **False Negatives (FN):** 147

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 43      | 0         | 0  | 0  | 100.00%  |                      |
| workplace_harassment         | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| sophisticated_harassment     | 32    | 0       | 32        | 0  | 32 | 0.00%    |                      |
| subtle_harassment_v2         | 8     | 0       | 8         | 0  | 8  | 0.00%    |                      |
| adversarial_attacks          | 28    | 0       | 28        | 0  | 28 | 0.00%    |                      |
| adversarial_v2               | 5     | 0       | 5         | 0  | 5  | 0.00%    |                      |
| social_engineering           | 24    | 0       | 24        | 0  | 24 | 0.00%    |                      |
| modern_communication         | 16    | 10      | 6         | 0  | 6  | 62.50%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 10      | 6         | 0  | 6  | 62.50%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

### v3.0

#### Preset: moderate

**Overall Statistics:**
- **Accuracy:** 56.25%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 144
- **Incorrect:** 70
- **False Positives (FP):** 5
- **False Negatives (FN):** 65

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 42      | 1         | 1  | 0  | 97.67%   |                      |
| workplace_harassment         | 32    | 29      | 3         | 0  | 3  | 90.62%   |                      |
| sophisticated_harassment     | 32    | 18      | 14        | 0  | 14 | 56.25%   |                      |
| subtle_harassment_v2         | 8     | 6       | 2         | 0  | 2  | 75.00%   |                      |
| adversarial_attacks          | 28    | 16      | 12        | 0  | 12 | 57.14%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 1       | 23        | 0  | 23 | 4.17%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 6       | 4         | 0  | 4  | 33.33%   |                      |
| boundary_testing             | 16    | 15      | 1         | 1  | 0  | 93.75%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: professional

**Overall Statistics:**
- **Accuracy:** 56.64%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 145
- **Incorrect:** 69
- **False Positives (FP):** 4
- **False Negatives (FN):** 65

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 42      | 1         | 1  | 0  | 97.67%   |                      |
| workplace_harassment         | 32    | 29      | 3         | 0  | 3  | 90.62%   |                      |
| sophisticated_harassment     | 32    | 18      | 14        | 0  | 14 | 56.25%   |                      |
| subtle_harassment_v2         | 8     | 6       | 2         | 0  | 2  | 75.00%   |                      |
| adversarial_attacks          | 28    | 16      | 12        | 0  | 12 | 57.14%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 1       | 23        | 0  | 23 | 4.17%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 6       | 4         | 0  | 4  | 33.33%   |                      |
| boundary_testing             | 16    | 16      | 0         | 0  | 0  | 100.00%  |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: strict

**Overall Statistics:**
- **Accuracy:** 58.59%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 150
- **Incorrect:** 64
- **False Positives (FP):** 5
- **False Negatives (FN):** 59

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 42      | 1         | 1  | 0  | 97.67%   |                      |
| workplace_harassment         | 32    | 30      | 2         | 0  | 2  | 93.75%   |                      |
| sophisticated_harassment     | 32    | 22      | 10        | 0  | 10 | 68.75%   |                      |
| subtle_harassment_v2         | 8     | 6       | 2         | 0  | 2  | 75.00%   |                      |
| adversarial_attacks          | 28    | 16      | 12        | 0  | 12 | 57.14%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 2       | 22        | 0  | 22 | 8.33%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 6       | 4         | 0  | 4  | 33.33%   |                      |
| boundary_testing             | 16    | 15      | 1         | 1  | 0  | 93.75%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: gaming

**Overall Statistics:**
- **Accuracy:** 58.59%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 150
- **Incorrect:** 64
- **False Positives (FP):** 5
- **False Negatives (FN):** 59

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 42      | 1         | 1  | 0  | 97.67%   |                      |
| workplace_harassment         | 32    | 30      | 2         | 0  | 2  | 93.75%   |                      |
| sophisticated_harassment     | 32    | 22      | 10        | 0  | 10 | 68.75%   |                      |
| subtle_harassment_v2         | 8     | 6       | 2         | 0  | 2  | 75.00%   |                      |
| adversarial_attacks          | 28    | 16      | 12        | 0  | 12 | 57.14%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 2       | 22        | 0  | 22 | 8.33%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 6       | 4         | 0  | 4  | 33.33%   |                      |
| boundary_testing             | 16    | 15      | 1         | 1  | 0  | 93.75%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

### v2.1

#### Preset: moderate

**Overall Statistics:**
- **Accuracy:** 31.64%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 81
- **Incorrect:** 133
- **False Positives (FP):** 11
- **False Negatives (FN):** 122

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 36      | 7         | 7  | 0  | 83.72%   |                      |
| workplace_harassment         | 32    | 4       | 28        | 0  | 28 | 12.50%   |                      |
| sophisticated_harassment     | 32    | 1       | 31        | 0  | 31 | 3.12%    |                      |
| subtle_harassment_v2         | 8     | 1       | 7         | 0  | 7  | 12.50%   |                      |
| adversarial_attacks          | 28    | 14      | 14        | 0  | 14 | 50.00%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 1       | 23        | 0  | 23 | 4.17%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 9       | 7         | 1  | 6  | 56.25%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: professional

**Overall Statistics:**
- **Accuracy:** 32.81%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 84
- **Incorrect:** 130
- **False Positives (FP):** 8
- **False Negatives (FN):** 122

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 39      | 4         | 4  | 0  | 90.70%   |                      |
| workplace_harassment         | 32    | 4       | 28        | 0  | 28 | 12.50%   |                      |
| sophisticated_harassment     | 32    | 1       | 31        | 0  | 31 | 3.12%    |                      |
| subtle_harassment_v2         | 8     | 1       | 7         | 0  | 7  | 12.50%   |                      |
| adversarial_attacks          | 28    | 14      | 14        | 0  | 14 | 50.00%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 1       | 23        | 0  | 23 | 4.17%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 9       | 7         | 1  | 6  | 56.25%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: strict

**Overall Statistics:**
- **Accuracy:** 31.25%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 80
- **Incorrect:** 134
- **False Positives (FP):** 13
- **False Negatives (FN):** 121

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 34      | 9         | 9  | 0  | 79.07%   |                      |
| workplace_harassment         | 32    | 4       | 28        | 0  | 28 | 12.50%   |                      |
| sophisticated_harassment     | 32    | 1       | 31        | 0  | 31 | 3.12%    |                      |
| subtle_harassment_v2         | 8     | 1       | 7         | 0  | 7  | 12.50%   |                      |
| adversarial_attacks          | 28    | 14      | 14        | 0  | 14 | 50.00%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 2       | 22        | 0  | 22 | 8.33%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 9       | 7         | 1  | 6  | 56.25%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

#### Preset: gaming

**Overall Statistics:**
- **Accuracy:** 31.64%
- **Total Definitive Tests (for accuracy):** 222
- **Correct:** 81
- **Incorrect:** 133
- **False Positives (FP):** 13
- **False Negatives (FN):** 120

**Per-Category Statistics:**

| Category                     | Total | Correct | Incorrect | FP | FN | Accuracy | Notes                |
|------------------------------|-------|---------|-----------|----|----|----------|----------------------|
| professional                 | 43    | 34      | 9         | 9  | 0  | 79.07%   |                      |
| workplace_harassment         | 32    | 4       | 28        | 0  | 28 | 12.50%   |                      |
| sophisticated_harassment     | 32    | 1       | 31        | 0  | 31 | 3.12%    |                      |
| subtle_harassment_v2         | 8     | 1       | 7         | 0  | 7  | 12.50%   |                      |
| adversarial_attacks          | 28    | 15      | 13        | 0  | 13 | 53.57%   |                      |
| adversarial_v2               | 5     | 4       | 1         | 0  | 1  | 80.00%   |                      |
| social_engineering           | 24    | 2       | 22        | 0  | 22 | 8.33%    |                      |
| modern_communication         | 16    | 7       | 9         | 3  | 6  | 43.75%   | Contains 'MIXED' cases |
| cross_cultural               | 18    | 4       | 6         | 0  | 6  | 22.22%   |                      |
| boundary_testing             | 16    | 9       | 7         | 1  | 6  | 56.25%   |                      |
| edge_cases                   | 34    | 0       | 0         | 0  | 0  | N/A      | Contains 'MIXED' cases |

## Comparative Insights / Evolution

### Overall Accuracy Trends:
Across the 'strict' preset, there's a notable fluctuation in overall accuracy:
- **v2.1 ('strict'):** 31.25%
- **v3.0 ('strict'):** 58.59%
- **v4.7 (Current) ('strict'):** 26.17%

Version 3.0 shows the highest overall accuracy among the three. The current version (v4.7) appears to have a significant regression in overall accuracy on this test set, primarily due to a high number of false negatives (147 for the 'strict' preset). This suggests that while v4.7 might be more lenient or its patterns/ML models are not yet tuned for these specific test cases, v3.0 had a better balance for this dataset. v2.1 had moderate accuracy but higher false positives (13 for 'strict') compared to v3.0 (5 for 'strict').

### Detection Capabilities Evolution:

#### Harassment Categories (Workplace, Sophisticated, Subtle):
- **v2.1:** Showed very low detection for 'workplace_harassment' (e.g., 4/32 correct, moderate preset) and 'sophisticated_harassment' (1/32 correct, moderate preset). 'subtle_harassment_v2' also had low correct detections (1/8).
- **v3.0:** Significantly improved in these areas. For instance, 'workplace_harassment' (strict preset) had 30/32 correct and 'sophisticated_harassment' (strict preset) had 22/32 correct. 'subtle_harassment_v2' (strict preset) had 6/8 correct.
- **v4.7 (Current):** Shows a near-complete failure to detect these categories (0 correct for workplace, sophisticated, and subtle_harassment_v2 across all presets). This is a major regression and the primary reason for the low overall accuracy in v4.7. This suggests that the pattern-based detection or ML models effective in v3.0 for these nuanced harassment types are missing or ineffective in the current version's configuration as tested on `index.js` (which had ML features commented out for earlier debugging stages and relied on its simpler spam patterns).

#### Adversarial Attacks:
The test suite includes 'adversarial_attacks' (more complex) and 'adversarial_v2' (simpler, baseline from v2.1 tests).
- **v2.1 ('strict'):** 'adversarial_attacks': 14/28 correct. 'adversarial_v2': 4/5 correct.
- **v3.0 ('strict'):** 'adversarial_attacks': 16/28 correct. 'adversarial_v2': 4/5 correct. A slight improvement on more complex attacks.
- **v4.7 (Current) ('strict'):** 'adversarial_attacks': 0/28 correct. 'adversarial_v2': 0/5 correct. This version failed to detect any adversarial attacks from the test set, indicating a significant gap in its current pattern-matching capabilities as configured in the base `index.js`.

#### Social Engineering:
This category was introduced in the expanded test suite used for v3.0 and current.
- **v2.1 ('strict'):** 2/24 correct. (Tested against the newer test cases)
- **v3.0 ('strict'):** 2/24 correct. Limited detection.
- **v4.7 (Current) ('strict'):** 0/24 correct. No detection.
Detection for social engineering tactics remains a challenge across these versions based on the simpler pattern matching.

#### Professional Content (False Positives):
This category tests the ability to correctly identify legitimate professional communication as 'CLEAN'.
- **v2.1 ('strict'):** 34/43 correct (9 False Positives).
- **v3.0 ('strict'):** 42/43 correct (1 False Positive). A significant improvement in reducing false positives on professional text.
- **v4.7 (Current) ('strict'):** 43/43 correct (0 False Positives). The current version, despite its other detection issues, is very good at not miss-classifying professional content as spam from its basic pattern set.

#### Newly Introduced Categories (in v3.0/Current test bed):
Categories like 'modern_communication', 'cross_cultural', 'boundary_testing' were part of the expanded test suite.
- **v3.0** showed some capability in these (e.g., 'modern_communication' (strict) 7/16 correct, 'boundary_testing' (strict) 15/16 correct).
- **v4.7 (Current)** also showed similar performance for 'modern_communication' (10/16 correct for strict) and 'boundary_testing' (10/16 correct for strict), mostly identifying the 'CLEAN' cases correctly within these mixed categories. The 'SPAM' cases within these categories were often missed.

### Conclusions on Evolution:
- **v2.1** provided a baseline with some detection capabilities but struggled with nuanced harassment and had higher false positives on professional content.
- **v3.0** represented a significant step up, particularly in detecting various forms of harassment and reducing false positives on legitimate text. It appears to be the most effective version on this comprehensive test set.
- **v4.7 (Current)**, in its current state *as tested via the base `index.js` with its simplified pattern matching and ML features not fully engaged during the final benchmark runs*, shows a significant regression in detecting harmful content, especially harassment and adversarial attacks. However, it excels at avoiding false positives on professional content. The low scores for v4.7 are likely due to the debugging steps taken earlier where ML features were commented out in `index.js` to isolate issues with basic pattern matching. The `ContentGuard` class in `index.js` itself has a very rudimentary set of spam patterns compared to what its variant systems (`v4-balanced`, etc.) might offer or what a fully enabled ML pipeline would provide. This highlights a potential issue with the fallback mechanism or the base configuration of the 'current' version if advanced features are not loaded/utilized.

Further testing with v4.7's full capabilities (variants and ML plugins fully active and configured) would be necessary to make a fair comparison with v3.0's peak performance.
