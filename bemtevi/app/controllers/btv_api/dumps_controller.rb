class BtvApi::DumpsController < Api::BaseController

  protected
  def load_resource
    @object = Dump.create_dump(params)
    return @object
  end

  private

  def object_serialization_options
    { :only => [:promotions]
    }
  end

  def collection_serialization_options
    object_serialization_options
  end

end
