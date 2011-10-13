Admin::ImagesController.class_eval do
  
  before_filter :load_templates
  
  def load_templates
    if params[:template_id].nil?
      @image_templates = ImageTemplate.all
    elsif params[:template_id] != "none"
      @image_template = ImageTemplate.find(params[:template_id])
    end
  end
  
end
