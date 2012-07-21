class Manager::PromotionsController < Manager::ResourceController

  before_filter :load_vendors, except: [:activate, :deactivate, :new]
  create.before :set_vendor_from_cookie
  
  def index
    @image_url = nil
    @promotions = Promotion.order('created_at DESC').where(deleted_at: nil).where(vendor_id: @vendor.id).paginate(page: params[:page] || 1, per_page: 12)
  end

  def activate
    promotion = Promotion.find(params[:id])
    promotion.activate
    redirect_to :back
  end

  def deactivate
    promotion = Promotion.find(params[:id])
    promotion.deactivate
    redirect_to :back
  end

  def new
    image_template_set = @object.build_image_template_set
    summary_template = image_template_set.image_templates.build :template_type => "summary"
    fill_missing_summary_overlays summary_template
    
    detail_template = image_template_set.image_templates.build :template_type => "detail"
    fill_missing_detail_overlays detail_template

    super
  end

  private

  def set_vendor_from_cookie
    @object.vendor_id = cookies[:vendor_id]
  end

  def load_vendors
    @vendors = Vendor.where(deleted_at: nil).order('name ASC')
    cookies[:vendor_id] = params[:vendor_id] if params[:vendor_id]
    @vendor = cookies[:vendor_id] ? Vendor.find(cookies[:vendor_id]) : @vendors.first
    if @vendor.nil? || @vendor.deleted?
      @vendor = @vendors.first
    end
  end
  
  def fill_missing_summary_overlays(image_template)
    product_image_overlay = image_template.overlays.build :tag => "product_image"
    image_overlay = product_image_overlay.build_image_overlay
    image_overlay.build_overlay_image

    promotion_title_overlay = image_template.overlays.build :tag => "title"
    promotion_title_overlay.build_text_overlay
  end

  def fill_missing_detail_overlays(image_template)
    product_image_overlay = image_template.overlays.build :tag => "product_image"
    image_overlay = product_image_overlay.build_image_overlay
    image_overlay.build_overlay_image

    promotion_title_overlay = image_template.overlays.build :tag => "title"
    promotion_title_overlay.build_text_overlay

    promotion_details_overlay = image_template.overlays.build :tag => "details"
    promotion_details_overlay.build_text_overlay
  end

end
