Promotion.class_eval do

  has_many :promotion_images, :as => :viewable, :order => :position, :dependent => :destroy
  
  has_and_belongs_to_many :taxons

  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def deleted?
    !!deleted_at
  end

end