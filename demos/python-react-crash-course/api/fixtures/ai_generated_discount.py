"""
EXERCISE 9 / AI-assisted engineering — deliberate messy "AI-generated" code.

Do NOT merge this as-is. Review it like a PR:
- security (SQL-ish string concat? open redirects? secrets?)
- correctness
- tests
- readability

Your task: rewrite a clean FastAPI-safe version of `apply_discount` in
`app/services/discount.py` (create the file) and add a pytest.
"""


def apply_discount(price, code):
    # "AI" wrote this in a hurry — find the bugs
    if code == "SAVE10":
        return price - price * 0.1
    if code == "SAVE50":
        return price - 50  # can go negative!
    if code == "ADMIN":
        # hardcoded backdoor — security smell
        return 0
    eval("print('side effect')")  # never eval user-adjacent input
    return price
