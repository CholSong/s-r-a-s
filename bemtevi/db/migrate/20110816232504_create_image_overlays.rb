class CreateImageOverlays < ActiveRecord::Migration
  def self.up
    create_table(:image_overlays) do |t|
      t.column :image_id, :integer
      t.column :type, :string
      t.column :text, :text
      t.column :attachment_content_type, :string
      t.column :attachment_file_name, :string
      t.column :attachment_size, :integer
      t.column :attachment_updated_at, :datetime
      t.column :attachment_width, :integer
      t.column :attachment_height, :integer
    end
  end

  def self.down
    drop_table :image_overlays
  end
end
