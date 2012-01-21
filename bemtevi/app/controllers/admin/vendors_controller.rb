class Admin::VendorsController < Admin::ResourceController
  before_filter :check_json_authenticity, :only => :index

  def index
    respond_with(@collection) do |format|
      format.html
      format.json { render :json => json_data }
    end
  end

  # override the destory method to set deleted_at value
  # instead of actually deleting the vendor.
  def destroy
    @vendor = Vendor.find(params[:id])

    current_time = Time.now()
    deleted_assets = 0

    products = @vendor.products.find(:all, :conditions => ['deleted_at is null'])
    products.each { |product| 
      product.deleted_at = current_time
      deleted_assets += 1 if product.save
    }

    promotions = @vendor.promotions.find(:all, :conditions => ['deleted_at is null'])
    promotions.each { |promotion| 
      promotion.deleted_at = current_time
      deleted_assets += 1 if promotion.save
    }

    @vendor.deleted_at = current_time

    if @vendor.save
      if deleted_assets == (products.size + promotions.size)
        flash.notice = I18n.t("notice_messages.vendor_deleted")
      else
        flash.notice = I18n.t("notice_messages.vendor_deleted_but_related_assets_not_deleted")
      end
    else
      if deleted_assets == 0
        flash.notice = I18n.t("notice_messages.vendor_not_deleted")
      else
        flash.notice = I18n.t("notice_messages.vendor_not_deleted_but_related_assets_deleted")
      end
    end

    respond_with(@vendor) do |format|
      format.html { redirect_to collection_url }
      format.js  { render_js_for_destroy }
    end
  end

  protected

  def find_resource
    Vendor.find(params[:id])
  end

  def location_after_save
    admin_vendors_url()
  end

  # Allow different formats of json data to suit different ajax calls
  def json_data
    json_format = params[:json_format] or 'default'
    case json_format
    when 'basic'
      collection.map {|p| {'id' => p.id, 'name' => p.name}}.to_json
    else
      collection.to_json()
    end
  end

  def collection
    return @collection if @collection.present?

    unless request.xhr?
      params[:search] ||= {}
      # Note: the MetaSearch scopes are on/off switches, so we need to select "not_deleted" explicitly if the switch is off
      if params[:search][:deleted_at_is_null].nil?
        params[:search][:deleted_at_is_null] = "1"
      end

      params[:search][:meta_sort] ||= "name.asc"
      @search = super.metasearch(params[:search])

      pagination_options = {:per_page  => Spree::Config[:admin_products_per_page],
                            :page      => params[:page]}

      @collection = @search.paginate(pagination_options)
    else
      includes = []

      @collection = super.where(["name #{LIKE} ?", "%#{params[:q]}%"])
      @collection = @collection.includes(includes).limit(params[:limit] || 10)

      @collection.uniq
    end

  end

end
