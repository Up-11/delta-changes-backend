-- AlterTable
ALTER TABLE "media" ADD COLUMN     "about_page_id" TEXT,
ADD COLUMN     "shareholder_id" TEXT;

-- CreateTable
CREATE TABLE "about_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Крупнейший девелопер Красноярска',
    "subtitle" TEXT NOT NULL DEFAULT 'ДЕЛЬТАСТРОЙ — эксперт в области создания качественной городской среды',
    "announcement" TEXT NOT NULL DEFAULT '20-летний опыт работы и достижение отметки в 1 млн м² построенного комфортного жилья',
    "stat1Value" TEXT NOT NULL DEFAULT '1 млн м²',
    "stat1Label" TEXT NOT NULL DEFAULT 'объем сданного жилья за 20 лет',
    "stat2Value" TEXT NOT NULL DEFAULT '8 побед',
    "stat2Label" TEXT NOT NULL DEFAULT 'в престижном российском градостроительном конкурсе новостроек ТОП-ЖК',
    "stat3Value" TEXT NOT NULL DEFAULT '500 тыс. м²',
    "stat3Label" TEXT NOT NULL DEFAULT 'общая площадь благоустроенных территорий в реализованных сити-проектах',
    "stat4Value" TEXT NOT NULL DEFAULT '500 событий в год',
    "stat4Label" TEXT NOT NULL DEFAULT 'количество социокультурных мероприятий, проводимых для жителей в сданных проектах',
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shareholders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shareholders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "timeline_events_sort_order_idx" ON "timeline_events"("sort_order");

-- CreateIndex
CREATE INDEX "shareholders_sort_order_idx" ON "shareholders"("sort_order");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_about_page_id_fkey" FOREIGN KEY ("about_page_id") REFERENCES "about_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_shareholder_id_fkey" FOREIGN KEY ("shareholder_id") REFERENCES "shareholders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
