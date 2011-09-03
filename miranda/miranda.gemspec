Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = 'miranda'
  s.version     = '0.10.01'
  s.summary     = 'Miranda is a set of extensions to Spree to support requirements for the Bemtevi applications.'
  s.description = 'Miranda is a set of extensions to Spree to support requirements for the Bemtevi applications.'
  s.required_ruby_version = '>= 1.8.7'

  s.author            = 'Evandro Carrenho'
  s.email             = 'evandro@bemtevi-mobile.com'
  s.homepage          = 'http://bemtevi-mobile.com'
  # s.rubyforge_project = 'actionmailer'

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.require_path = 'lib'
  s.requirements << 'none'

  s.add_dependency('spree_api', '>= 0.60.1')
  s.add_dependency('spree_auth', '>= 0.60.1')
  s.add_dependency('spree_promo', '>= 0.60.1')
end
