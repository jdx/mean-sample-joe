var chai = require('chai')
chai.use(require('chai-as-promised'))
var expect = chai.expect

describe('making a post', function () {
  it('creates an account and a new post', function () {
    browser.get('http://localhost:3001')
    
    // click login
    element(by.css('nav .login')).click()
    
    // fill out and submit register form
    element(by.model('username')).sendKeys('dick')
    element(by.model('password')).sendKeys('dick')
    element(by.css('form .btn')).click()
    
    // submit a new post on the posts page
    var post = 'my new post' + Math.random()
    element(by.model('postBody')).sendKeys(post)
    element(by.css('form .btn-default')).click()
    browser.waitForAngular(); 

    // the user should now their post as the first post on the page
    expect(element.all(by.css('ul.list-group li')).first().getText()).to.eventually.contain(post)
  })
})