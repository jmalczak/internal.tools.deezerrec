namespace DeezerRec.Aspects
{
    using System;

    using NLog;

    using PostSharp.Aspects;

    [Serializable]
    public sealed class Logger : OnMethodBoundaryAspect
    {
        public override void OnException(MethodExecutionArgs args)
        {
            LogManager.GetCurrentClassLogger().LogException(LogLevel.Error, "Exception", args.Exception);
        }
    }
}
