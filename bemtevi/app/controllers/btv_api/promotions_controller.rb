class BtvApi::PromotionsController < Api::BaseController
  
  private
    def object_serialization_options
      { :only => [:id, :name, :description, :starts_at, :expires_at],
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
