class BtvApi::PromotionsController < Api::BaseController
  
  private
  
  def collection
    params[:search] ||= {}
    if params[:search][:deleted_at_is_null].nil?
      params[:search][:deleted_at_is_null] = "1"
    end
    if params[:search][:vendor_deleted_at_is_null].nil?
      params[:search][:vendor_deleted_at_is_null] = "1"
    end
    super
  end
  
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
