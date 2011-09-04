require 'bemtevi_hooks'

module SpreeSite
  class Engine < Rails::Engine
    
    def self.activate
      # Add your custom site logic here
      Dir.glob(File.join(File.dirname(__FILE__), "../app/**/*_decorator*.rb")) do |c|
        Rails.env.production? ? require(c) : load(c)
      end

      Spree::Config.set :site_name => 'Bemtevi Mobile',
      :site_url => 'bemtevi-mobile.com',
      :default_locale => 'pt-BR',
      :allow_locale_switching => false,
      :default_country_id => 28,
      :logo => '/images/bemtevi/bemtevi_logo.png',
      :admin_interface_logo => 'bemtevi/bemtevi_logo.png'

    end
    
    def load_tasks
    end
    
    config.to_prepare &method(:activate).to_proc
  end
end