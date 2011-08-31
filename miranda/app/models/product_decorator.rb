Product.class_eval do

  has_many :image_overlays

  def image_url
    if !images.nil? && !images[0].nil? 
      images[0].attachment.url(:original)
    end
  end

end