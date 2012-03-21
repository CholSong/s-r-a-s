class Manager::ImageTemplateSetsController < Admin::ResourceController
  #before_filter :check_json_authenticity, :only => :index

  def index
    respond_with(@collection) do |format|
      format.html
      format.json { render :json => json_data }
    end
  end

  protected

  def json_data
    collection.to_json(
      :only => [:id, :vendor_id, :name],
      :include => {
        :image_templates => {
          :only => [:id, :template_type],
          :include => { 
            :background_image => {
              :only => [:id],
              :methods => [:url, :thumbnail_url]
            },
            :overlays => { 
              :only => [:id, :position_x, :position_y, :width, :height, :tag],
              :methods => [:overlay_type],
              :include => {
                :text_overlay => {
                  :only => [:id, :font_family, :font_size, :font_weight, :font_style, :text_align, :text_decoration, :color, :text]
                }, 
                :image_overlay => { 
                  :only => [:id, :position_x, :position_y, :width, :height],
                  :include => { 
                    :overlay_image => {
                      :only => [:id],
                      :methods => [:url]
                    }
                  }
                }
              }
            }
          }
        }
      })
  end

  def collection
    return @collection if @collection.present?

    unless request.xhr?
      params[:search] ||= {}
      params[:search][:meta_sort] ||= "vendor.name.asc"
      @search = super.metasearch(params[:search])
  
      pagination_options = {:per_page  => Spree::Config[:admin_products_per_page],
                            :page      => params[:page]}
  
      @collection = @search.paginate(pagination_options)
    else
      if params[:vendor_id].nil?
        @collection = super.where(["vendor_id is not null"])
      else
        @collection = super.where(["vendor_id = ?", "#{params[:vendor_id]}"])
      end
    end
  end

end
