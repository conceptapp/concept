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
   'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
 }
}