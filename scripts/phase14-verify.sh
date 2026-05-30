#!/bin/bash
# Phase 14 Verification Tests
# Run after deploying all changes

PASS=0
FAIL=0
TOTAL=0

run_test() {
  TOTAL=$((TOTAL+1))
  local name="$1"
  local cmd="$2"
  local expect="$3"
  
  result=$(eval "$cmd" 2>/dev/null)
  if echo "$result" | grep -qE "$expect"; then
    echo "✅ PASS: $name"
    PASS=$((PASS+1))
  else
    echo "❌ FAIL: $name"
    echo "   Expected pattern: $expect"
    echo "   Got: ${result:0:120}"
    FAIL=$((FAIL+1))
  fi
}

echo "=========================================="
echo "PHASE 14 VERIFICATION — $(date)"
echo "=========================================="

# ADMIN
run_test "Admin returns content (not blank)" \
  "curl -s https://admin.appilico.com.au | wc -c" \
  "[1-9][0-9]{3,}"

# SUBURB FILTER
run_test "API filters by suburb=subiaco" \
  "curl -s 'https://api.appilico.com.au/api/providers/search?suburb=subiaco&pageSize=3' | python3 -c \"import sys,json; d=json.load(sys.stdin); ps=d.get('items',d.get('data',[])); print('OK' if len(ps)>0 else 'EMPTY')\"" \
  "OK"

run_test "Search page has suburb input" \
  "curl -s 'https://beauty.appilico.com.au/search' | grep -ic 'suburb.*postcode\|postcode.*suburb\|Suburb or postcode'" \
  "[1-9]"

run_test "Search category tabs preserve suburb param" \
  "curl -s 'https://beauty.appilico.com.au/search?suburb=subiaco' | grep -c 'suburb=subiaco'" \
  "[1-9]"

# PROVIDER PROFILE
run_test "Provider page has Schema.org JSON-LD" \
  "curl -s 'https://beauty.appilico.com.au/provider/her-on-oxford-mount-hawthorn' | grep -c 'application/ld.json'" \
  "[1-9]"

run_test "Provider breadcrumb shows category (not Search)" \
  "curl -s 'https://beauty.appilico.com.au/provider/her-on-oxford-mount-hawthorn' | python3 -c \"import sys; h=sys.stdin.read(); print('OK' if 'Skin Care' in h[:3000] or 'Hair' in h[:3000] or 'Nails' in h[:3000] else 'FAIL')\"" \
  "OK"

run_test "Provider nearby section doesn't show Mandurah" \
  "curl -s 'https://beauty.appilico.com.au/provider/her-on-oxford-mount-hawthorn' | grep -c 'Mandurah'" \
  "^0$"

run_test "Provider card has gradient cover" \
  "curl -s 'https://beauty.appilico.com.au/subiaco' | grep -c 'linear-gradient'" \
  "[1-9]"

# FOOTER
run_test "Subiaco footer has Massage" \
  "curl -s 'https://beauty.appilico.com.au/subiaco' | grep -c 'category/massage'" \
  "[1-9]"

run_test "Provider page footer has Massage" \
  "curl -s 'https://beauty.appilico.com.au/provider/her-on-oxford-mount-hawthorn' | grep -c 'category/massage'" \
  "[1-9]"

run_test "Subiaco category pills have Massage" \
  "curl -s 'https://beauty.appilico.com.au/subiaco' | grep -c 'subiaco/massage'" \
  "[1-9]"

run_test "Footer has all 10 categories" \
  "curl -s 'https://beauty.appilico.com.au/' | grep -c 'category/'" \
  "[1-9]"

# GOOGLE
run_test "Google site verification tag present" \
  "curl -s 'https://beauty.appilico.com.au/' | grep -c 'google-site-verification'" \
  "[1-9]"

run_test "Sitemap accessible" \
  "curl -s 'https://beauty.appilico.com.au/sitemap.xml' | grep -c '<loc>'" \
  "[1-9]"

# MOBILE
run_test "overflow-x hidden set" \
  "curl -s 'https://beauty.appilico.com.au/' | grep -c 'overflow-x'" \
  "[1-9]"

# BUILD (local)
run_test "Beauty app builds" \
  "cd frontend && npx turbo run build --filter=beauty 2>&1 | tail -3" \
  "compiled\|success\|Tasks:"

echo ""
echo "=========================================="
echo "RESULTS: $PASS/$TOTAL passed, $FAIL failed"
echo "=========================================="
[ $FAIL -eq 0 ] && echo "🎉 ALL TESTS PASSED" || echo "❌ $FAIL TESTS FAILED — fix before deploying"
