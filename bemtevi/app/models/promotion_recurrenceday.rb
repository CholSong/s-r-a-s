class PromotionRecurrenceday < ActiveRecord::Base
	belongs_to :promotion
	attr_accessible :day
end
