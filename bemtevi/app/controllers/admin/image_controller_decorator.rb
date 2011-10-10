Admin::ImagesController.class_eval do
  before_filter :my_load_data
  
  def my_load_data
    if !params[:template_id].nil?
      if params[:template_id] != "none"
        @image_template = ImageTemplate.find(params[:template_id])
      end
    else
      @image_templates = ImageTemplate.all
    end
    load_data
  end
end
