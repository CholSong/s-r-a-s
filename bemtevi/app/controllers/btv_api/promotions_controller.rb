class BtvApi::PromotionsController < Api::BaseController
  
  private
    def object_serialization_options
      { :only => [:id, :name, :description, :starts_at, :expires_at, :deleted_at, :vendor_id],
        :include => { 
          :promotion_images => {
            :only => [:id],
            :methods => [:type, :url]
          }
        },
        :methods => [:taxon_ids]
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end
end
