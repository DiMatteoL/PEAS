# Notes

Thank you for the assignment, really enjoyed it !

## What I would like to improve

### Typing

Some typescript error still exist, (not fixed to avoid investing too much time in the project):

- **Decorator errors in the test file**: Looking into Typescript decorator doc should enlighten me.
- **Store `unknown property` error (is not of the type StoreValue)**: Using the Store value type for unknown keys lead to other errors. If I had more time, I would create a new property `storeValues` instead of storing the values directly in the class.

### Security

I like code that can't be missused, here it's still possible to access object properties when not using the intended methods.
Using `Object.defineProperty` in Restrict is the answer but I had trouble with the Class constructor, and felt like I was spending too much time on it.

### Code Quality

I've allowed some bad practices in, like using flags, ternaries, and a few methods with more than one responsibility.

## What I would do to 10x the assignment

- Fix all previously mentionned issues.
- Test/lint running CI.
- Allow `paths` as parameters of `allowedToRead` and `allowedToWrite`.
- `ts-jest` is going to feel slow quite soon, I'd change it with `swc` or `vitest`.
- Runtime checks (ex: with zod)
