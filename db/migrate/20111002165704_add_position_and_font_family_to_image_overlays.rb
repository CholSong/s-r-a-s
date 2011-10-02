class AddPositionAndFontFamilyToImageOverlays < ActiveRecord::Migration
  def self.up
    add_column :image_overlays, :position_x, :integer
    add_column :image_overlays, :position_y, :integer
    add_column :image_overlays, :font_family, :string
  end

  def self.down
    remove_column :image_overlays, :position_x
    remove_column :image_overlays, :position_y
    remove_column :image_overlays, :font_family
  end
end
