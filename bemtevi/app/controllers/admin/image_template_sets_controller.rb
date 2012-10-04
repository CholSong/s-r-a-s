class Admin::ImageTemplateSetsController < Admin::ResourceController
  def new
    summary_template = @object.image_templates.build :template_type => "summary"
    summary_template.build_background_image
    fill_missing_summary_overlays summary_template
    
    detail_template = @object.image_templates.build :template_type => "detail"
    detail_template.build_background_image
    fill_missing_detail_overlays detail_template
    super
  end

  def edit
    @object.image_templates.each { |template|
      if template.background_image.nil?
        template.build_background_image
      end
      if template.template_type == "summary"
        fill_missing_summary_overlays template
      else
        fill_missing_detail_overlays template
      end
    }
    
    super
  end

  def uploadimage
    name = params[:image_file].original_filename
    render :text=>name.inspect and return;
  end
  def update
    #render :text=> params.inspect and return
    super
  end

  protected

  def collection
    return @collection if @collection.present?

    params[:search] ||= {}
    params[:search][:meta_sort] ||= "vendor.name.asc"
    @search = super.metasearch(params[:search])

    pagination_options = {:per_page  => Spree::Config[:admin_products_per_page],
                          :page      => params[:page]}

    @collection = @search.paginate(pagination_options)
  end

  private
  
  def fill_missing_summary_overlays(image_template)
    product_image_overlay = image_template.overlays.select {|overlay| overlay.tag == "product_image"}[0]
    if product_image_overlay.nil?
      product_image_overlay = image_template.overlays.build :tag => "product_image"
    end
    image_overlay = product_image_overlay.image_overlay
    image_overlay = product_image_overlay.build_image_overlay if image_overlay.nil?
    image_overlay.build_overlay_image if image_overlay.overlay_images.nil?
    @summarry_img_overlay = image_overlay

    promotion_title_overlay = image_template.overlays.select {|overlay| overlay.tag == "title"}[0]
    if promotion_title_overlay.nil?
      promotion_title_overlay = image_template.overlays.build :tag => "title"
      promotion_title_overlay.build_text_overlay
    end
  end

  def fill_missing_detail_overlays(image_template)
    product_image_overlay = image_template.overlays.select {|overlay| overlay.tag == "product_image"}[0]
    if product_image_overlay.nil?
      product_image_overlay = image_template.overlays.build :tag => "product_image"
    end
    image_overlay = product_image_overlay.image_overlay
    image_overlay = product_image_overlay.build_image_overlay if image_overlay.nil?
    image_overlay.build_overlay_image if image_overlay.overlay_images.nil?
    @detail_img_overlay = image_overlay

    promotion_title_overlay = image_template.overlays.select {|overlay| overlay.tag == "title"}[0]
    if promotion_title_overlay.nil?
      promotion_title_overlay = image_template.overlays.build :tag => "title"
      promotion_title_overlay.build_text_overlay
    end

    promotion_details_overlay = image_template.overlays.select {|overlay| overlay.tag == "details"}[0]
    if promotion_details_overlay.nil?
      promotion_details_overlay = image_template.overlays.build :tag => "details"
      promotion_details_overlay.build_text_overlay
    end
  end

end
