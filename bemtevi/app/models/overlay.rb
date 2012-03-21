class Overlay < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :image_template
  has_one :text_overlay, :dependent => :destroy
  has_one :image_overlay, :dependent => :destroy

  # Bemtevi TODO
  # add logic to reject_if
  accepts_nested_attributes_for :text_overlay, :allow_destroy => true
  accepts_nested_attributes_for :image_overlay, :allow_destroy => true

  def overlay_type
    return :text if !text_overlay.nil?
    return :image if !image_overlay.nil?
    return :unknown
  end

end
