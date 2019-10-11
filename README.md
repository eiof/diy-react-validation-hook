# DIY React Validation Hook

Example of a simple way to implement validation with promise-based form validation.

### Running the example

```console
npm install
npm start
```

### Notes

This example uses two libraries that can probably be excluded

- [bluebird](http://bluebirdjs.com/docs/api-reference.html)
  - Use `Promise.reflect` as an alternative to `Promise.settleAll`
  - Can loop through promise inspections
- [immer](https://immerjs.github.io/)
  - Immutable validators and error state
