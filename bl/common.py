import string
import random

def randomIdGenerator(
    size=6, chars=string.ascii_lowercase + string.digits + string.ascii_uppercase
):
    return "".join(random.choice(chars) for _ in range(size))
