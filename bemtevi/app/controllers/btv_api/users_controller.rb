class BtvApi::UsersController < Api::BaseController

  private
    def object_serialization_options
      { :only => [:email, :id, :name],
        :include => { 
          :taxonomies => { :only => [:id, :name, :updated_at] },
          :addresses => { 
            :only => [:address1, :address2, :city, :zipcode, :phone, :created_at, :updated_at, :alternative_phone, :latitude, :longitude],
            :include => { 
              :country => { :only => [:name] },
              :state => { :only => [:name, :abbr]}
            }
          }
        }
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
