require 'bemtevi_hooks'

module SpreeSite
  class Engine < Rails::Engine
    
    def self.activate
      # Add your custom site logic here
      Dir.glob(File.join(File.dirname(__FILE__), "../app/**/*_decorator*.rb")) do |c|
        Rails.env.production? ? require(c) : load(c)
      end

      if Spree::Config.instance
        Spree::Config.set :site_name => 'Bemtevi Mobile',
        :site_url => 'bemtevi-mobile.com',
        :default_locale => 'pt-BR',
        #:default_locale => 'en-US',
        :allow_locale_switching => false,
        :default_country_id => 28,
        :logo => '/images/bemtevi/bemtevi_logo.png',
        :admin_interface_logo => 'bemtevi/bemtevi_logo.png',
        # Bemtevi
        # :full_admin_ui - This configuration toggles between the full admin UI and the
        # simplified one. The simplified UI is currently used on production, untill we
        # have the merchant UI for creating promotions.
        :full_admin_ui => false

        s3_config = YAML.load(File.read(Rails.root + 'config' + 's3.yml'))[Rails.env].with_indifferent_access
        Spree::Config.set s3_config
      end

    end
    
    def load_tasks
    end
    
    config.to_prepare &method(:activate).to_proc
  end
end