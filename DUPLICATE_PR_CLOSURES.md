# Duplicate PR Closure Log

## Security Fix: CWE-338 Insecure Randomness

**Canonical PR:** #171 ✅ **MERGED** (2026-09-12T21:54:36Z)

### Closed Duplicate PRs

The following PRs were addressing the same security vulnerability and have been closed. The fix is now in the canonical PR #171 which has been merged to master.

| PR | Title | Status | Closed | Reason |
|----|---------|---------|---------|---------|
| #170 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #168 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #167 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #165 | 🔒 Fix insecure randomness in TrinityKeystore cryptographic salt generation | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #164 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #162 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #161 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #159 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #158 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #156 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #155 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #153 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #152 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #150 | 🔒 Fix Insecure Randomness in TrinityKeystore | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #149 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #148 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #147 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #144 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |
| #143 | 🔒 Fix Insecure Randomness for Cryptographic Salt in App.tsx | ✅ CLOSED | 2026-09-12 | Duplicate of #171 |

### Summary
- **Total Duplicates:** 19 closed
- **Canonical PR:** #171 (merged to master)
- **Fix Verification:** 60+ tests in App.test.tsx
- **Documentation:** SECURITY.md, CHANGELOG.md
- **Status:** ✅ COMPLETE

### Closure Comment Template

All closed PRs received the following standardized comment:

---

> ✅ **Duplicate Fixed in PR #171**
>
> This duplicate PR has been closed. The security vulnerability (CWE-338 insecure randomness) has been fixed in the canonical **PR #171** which is now merged to master.
>
> **What was fixed:**
> - Replaced `Math.random()` with `crypto.getRandomValues()` for cryptographic salt generation in TrinityKeystore
> - Added comprehensive test suite (60+ tests) verifying the fix
> - Full details: https://github.com/420Entropy/420247/pull/171
>
> **Verification:**
> - Run: `npm test -- App.test.tsx` (all 60+ tests passing)
> - See: `SECURITY.md` for detailed vulnerability report
>
> Thank you for your contribution to fixing this security issue!

---

## Notes

- This log documents the cleanup of duplicate PR efforts for the same security fix
- All duplicates addressed the same vulnerability: CWE-338 insecure randomness
- The canonical fix (PR #171) was selected based on:
  - Most recent creation date
  - Highest quality implementation
  - Comprehensive PR description
  - Successful merge status
