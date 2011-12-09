class BtvApi::TaxonomiesController < Api::BaseController

  private

    def object_serialization_options
      { :only => [:id, :name],
        :include => { 
          :taxons => { :only => [:id, :name, :parent_id] } 
        }
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
