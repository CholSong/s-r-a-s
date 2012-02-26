class ImageOverlay < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :overlay
  has_one :overlay_image, :as => :viewable, :dependent => :destroy

  # Bemtevi TODO
  # add logic to reject_if
  accepts_nested_attributes_for :overlay_image, :allow_destroy => true

end
