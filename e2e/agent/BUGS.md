# Appilico Market — Bug Tracker

> Auto-maintained by the AI test agent. Last updated: 2026-05-25

| Status | Count |
|--------|-------|
| 🔴 Open | 7 |
| ✅ Resolved | 2 |

---

## BUG-001 Profile update saves address and postcode `open`

- **Area**: auth
- **First seen**: 2026-05-25
- **Test**: api-profile-update

> [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
> 
> Expected: [32m"6160"[39m
> Received: [31mundefined[39m

## BUG-002 API health check returns healthy `open`

- **Area**: api
- **First seen**: 2026-05-25
- **Test**: api-health

> [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
> 
> Expected: [32m200[39m
> Received: [31m404[39m

## BUG-005 Profile page shows address and postcode fields `open`

- **Area**: auth
- **First seen**: 2026-05-25
- **Test**: ui-profile-address

> [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
> 
> Locator: locator('text=Postcode')
> Expected: visible
> Timeout: 10000ms
> Error: element(s) not found
> 
> Call log:
> [2m  - Expect "toBeVisible" with timeout 10000ms[22m
> [2m  - waiting for locator('text=Postcode')[22m

## BUG-006 Nearest suburb endpoint returns a suburb `open`

- **Area**: location
- **First seen**: 2026-05-25
- **Test**: api-nearest-suburb

> [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
> 
> Expected: [32m200[39m
> Received: [31m404[39m

## BUG-007 Search page accepts postcode for proximity sort `open`

- **Area**: search
- **First seen**: 2026-05-25
- **Test**: ui-search-postcode

> [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m
> 
> Expected pattern: [32m/6160|distance|near/[39m
> Received string:  [31m""[39m

## BUG-008 Services login page loads with email/password form `open`

- **Area**: services
- **First seen**: 2026-05-25
- **Test**: ui-services-login

> page.goto: net::ERR_NAME_NOT_RESOLVED at https://services.appilico.com.au/login
> Call log:
> [2m  - navigating to "https://services.appilico.com.au/login", waiting until "load"[22m

## BUG-009 Services header shows appilico SERVICES logo `open`

- **Area**: services
- **First seen**: 2026-05-25
- **Test**: ui-services-logo

> page.goto: net::ERR_NAME_NOT_RESOLVED at https://services.appilico.com.au/
> Call log:
> [2m  - navigating to "https://services.appilico.com.au/", waiting until "load"[22m

## BUG-004 Header shows Sign up and Log in for anonymous users `resolved`

- **Area**: auth
- **First seen**: 2026-05-25
- **Resolved**: 2026-05-25
- **Test**: ui-header-auth

> [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
> 
> Locator: locator('a[href=\'/signup\'], a:has-text(\'Sign up\')').first()
> Expected: visible
> Timeout: 10000ms
> Error: element(s) not found
> 
> Call log:
> [2m  - Expect "toBeVisible" with timeout 10000ms[22m
> [2m  - waiting for locator('a[href=\'/signup\'], a:has-text(\'Sign up\')').first()[22m

## BUG-003 Signup page loads with form fields `resolved`

- **Area**: auth
- **First seen**: 2026-05-25
- **Resolved**: 2026-05-25
- **Test**: ui-signup-page

> [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
> 
> Locator: locator('input[type=\'text\']').first()
> Expected: visible
> Timeout: 10000ms
> Error: element(s) not found
> 
> Call log:
> [2m  - Expect "toBeVisible" with timeout 10000ms[22m
> [2m  - waiting for locator('input[type=\'text\']').first()[22m

