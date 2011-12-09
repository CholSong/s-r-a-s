class BtvApi::VendorsController < Api::BaseController

  private

    def object_serialization_options
      { :only => [ :id, :name, :description ] }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
