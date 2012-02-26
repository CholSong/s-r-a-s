class ImageTemplate < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :image_template_set
  has_one :background_image, :as => :viewable, :dependent => :destroy
  has_many :overlays, :dependent => :destroy

  # Bemtevi TODO
  # add logic to reject_if
  accepts_nested_attributes_for :background_image, :allow_destroy => true
  accepts_nested_attributes_for :overlays, :allow_destroy => true

end
