module.exports = {
 root: true,
 // parser: 'babel-eslint',
 parser: 'vue-eslint-parser',
 parserOptions: {
   sourceType: 'module',
   parser: 'babel-eslint',
   ecmaVersionn: 2017
 },
 env: {
   browser: true,
   commonjs: true,
   es6: true
 },
 extends: [
 	'standard',
 	'plugin:vue/strongly-recommended' // base, essential, strongly-recommended, recommended
 ],
 'rules': {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/v-on-style': 'off', // not working for drag and drop events, v-on is required
    'vue/max-attributes-per-line': ['error', {
      'singleline': 3, // allow 3 attributes in a single line tag
      'multiline': {
        'max': 1,
        'allowFirstLine': true
      }
   }]
 }
}