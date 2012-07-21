class Manager::ResourceController < Admin::ResourceController

  layout 'manager'

  protected
  
  def collection_url(options = {})
    if parent_data.present?
      polymorphic_url([:manager, parent, model_class], options)
    else
      polymorphic_url([:manager, model_class], options)
    end
  end

end
