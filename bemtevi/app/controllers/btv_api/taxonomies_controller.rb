class BtvApi::TaxonomiesController < Api::BaseController

  private

  def collection
    params[:search] ||= {}
    if params[:search][:deleted_at_is_null].nil?
      params[:search][:deleted_at_is_null] = "1"
    end
    super
  end

  def object_serialization_options
    { :only => [:id, :name, :deleted_at] }
  end

  def collection_serialization_options
    object_serialization_options
  end

end
