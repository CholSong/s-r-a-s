class BtvApi::VendorsController < Api::BaseController

  private

    def object_serialization_options
      { :only => [ :id, :name, :description ],
        :include => {
          :vendor_images => {
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
