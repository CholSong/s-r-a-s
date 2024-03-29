class OverlayImage < Asset
  validate :no_attachement_errors
  has_attached_file :attachment,
                    :styles => { :mini => '48x48>', :small => '100x100>', :product => '240x240>', :large => '600x600>' },
                    :default_style => :product,
                    :url => "/assets/overlays/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/assets/overlays/:id/:style/:basename.:extension"

  # save the w,h of the original image (from which others can be calculated)
  # we need to look at the write-queue for images which have not been saved yet
  after_post_process :find_dimensions

  def url
    attachment.url(:original)
  end

  def thumbnail_url
    attachment.url(:small)
  end
  
  def find_dimensions
    temporary = attachment.queued_for_write[:original]
    filename = temporary.path unless temporary.nil?
    filename = attachment.path if filename.blank?
    geometry = Paperclip::Geometry.from_file(filename)
    self.attachment_width  = geometry.width
    self.attachment_height = geometry.height
    self.attachment_aspect_ratio = (self.attachment_width.to_f / self.attachment_height.to_f * 10).round.to_f / 10
  end

  # if there are errors from the plugin, then add a more meaningful message
  def no_attachement_errors
    unless attachment.errors.empty?
      # uncomment this to get rid of the less-than-useful interrim messages
      # errors.clear
      errors.add :attachment, "Paperclip returned errors for file '#{attachment_file_name}' - check ImageMagick installation or image source file."
      false
    end
  end
end