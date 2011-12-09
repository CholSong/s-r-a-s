class BtvApi::TaxonsController < Api::BaseController

  private

    def object_serialization_options
      { :only => [:id, :name, :parent_id, :taxonomy_id] }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
