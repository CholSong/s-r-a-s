class BtvApi::ImagesController < Api::BaseController
  
  private
    def object_serialization_options
      { :only => [:id],
        :methods => [:url]
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
