class Manager::ResourceController < Admin::ResourceController

  layout 'manager'
  before_filter :set_user_time_zone

  protected
  
  def collection_url(options = {})
    if parent_data.present?
      polymorphic_url([:manager, parent, model_class], options)
    else
      polymorphic_url([:manager, model_class], options)
    end
  end
  def set_user_time_zone
  	Time.zone = current_user.time_zone
  end

end
