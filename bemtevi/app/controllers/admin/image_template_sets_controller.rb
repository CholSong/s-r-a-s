class Admin::ImageTemplateSetsController < Admin::ResourceController

  def new
    summary_template = @object.image_templates.build :template_type => "summary"
    summary_template.build_background_image
    fill_missing_overlays summary_template
    
    detail_template = @object.image_templates.build :template_type => "detail"
    detail_template.build_background_image
    fill_missing_overlays detail_template

    super
  end

  def edit
    @object.image_templates.each { |template|
      if template.background_image.nil?
        template.build_background_image
      end
      fill_missing_overlays template
    }
    
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
  
  def fill_missing_overlays(image_template)
    missing_image_overlays = 2
    missing_text_overlays = 2
    
    if !image_template.overlays.nil?
      image_template.overlays.each { |overlay|
        missing_image_overlays -= 1 if !overlay.image_overlay.nil?
        missing_text_overlays -= 1 if !overlay.text_overlay.nil?
      }
    end

    missing_image_overlays.times do
      overlay = image_template.overlays.build
      image_overlay = overlay.build_image_overlay
      image_overlay.build_overlay_image
    end
    
    missing_text_overlays.times do
      overlay = image_template.overlays.build
      overlay.build_text_overlay
    end
  end

end
