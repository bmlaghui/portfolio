import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ProfileModule } from './profile/profile.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { BlogModule } from './blog/blog.module';
import { SkillsModule } from './skills/skills.module';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { UploadsModule } from './uploads/uploads.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ProjectsModule,
    ProfileModule,
    ExperienceModule,
    EducationModule,
    BlogModule,
    SkillsModule,
    ContactModule,
    StatsModule,
    UploadsModule,
    TestimonialsModule,
    NewsletterModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
