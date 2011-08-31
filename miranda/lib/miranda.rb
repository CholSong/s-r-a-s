require 'spree_core'
require 'miranda_hooks'

module Miranda
  class Engine < Rails::Engine
    
    def self.activate
      Dir.glob(File.join(File.dirname(__FILE__), "../app/**/*_decorator*.rb")) do |c|
        Rails.env.production? ? require(c) : load(c)
      end
      
      # Register image overlays
      # removing this temporarily, as it works only on Spree 0.70.x
      # [ImageOverlay::Overlays::Image,
      #  ImageOverlay::Overlays::Text
      # ].each &:register

    end

    config.autoload_paths += %W(#{config.root}/lib)
    config.to_prepare &method(:activate).to_proc

  end
end
