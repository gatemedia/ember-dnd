$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "gatemedia-dnd/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "gatemedia-dnd"
  s.version     = GatemediaDnd::VERSION
  s.authors     = ["Mike Aski"]
  s.email       = ["mike.aski@gatemedia.ch"]
  s.homepage    = "http://www.gatemedia.ch"
  s.summary     = "Ember.js DnD helpers."
  s.description = "Provides basic helpers to add support for DnD to an application's views."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_runtime_dependency "rails", ">= 3.2.14"
end
