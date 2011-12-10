class BtvApi::ProductsController < Api::BaseController
  include Spree::Search

  private
    def collection
      @searcher = Spree::Config.searcher_class.new(params)
      @collection = @searcher.retrieve_products
    end

    def object_serialization_options
      { :only => [:name, :id, :available_on, :vendor_id ],
        :include => { 
          :images => {
            :only => [:id],
            :methods => [:type, :url]
          }
        }
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end