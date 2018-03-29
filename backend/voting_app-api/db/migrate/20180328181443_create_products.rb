class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.string :title
      t.string :description
      t.string :url
      t.integer :votes
      t.string :submitterAvatarUrl
      t.string :productImageUrl

      t.timestamps
    end
  end
end
