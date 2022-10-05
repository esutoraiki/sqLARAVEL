# sqlaravel

Base to start projects in Laravel, simply and quickly

## Requirements

* Minimum Node v16.7.0

## Installation

1. Open a terminal at the root of your project

2. Execute
   
   ```bash
   npm i sqlaravel
   npm explore sisass -- npm run init -- --path ../../resources
   ```

## Use

sqLaravel works with **Gulp**, to be able to use it, it is necessary to be located in the resources folder and execute gulp command

```bash
cd resources
gulp
```

### Gulp task

#### cleanfiles

This task helps to remove temporary files in the project

```bash
gulp cleanfiles
```

### Parameters for the gulp command

#### minjs (boolean: false)

True to minify the js files. It is executed as follows (*preferably*)

```bash
gulp --minjs true
```

or

```bash
gulp --minjs
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
