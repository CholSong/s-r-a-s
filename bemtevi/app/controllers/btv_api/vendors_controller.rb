class BtvApi::VendorsController < Api::BaseController

  private

    def object_serialization_options
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
